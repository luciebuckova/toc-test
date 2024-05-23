import { FC, memo, useState, useCallback } from 'react';
import { useTableOfContents } from './useTableOfContents.ts';
import { ContentItem } from './types/ContentItem.ts';

type TableOfContentsProps = ReturnType<typeof useTableOfContents>;

const RenderItem: FC<{
    item: ContentItem;
    itemsMap: Map<string, ContentItem[]>;
    onClick: (item: ContentItem) => () => void;
    isExpanded: (item: ContentItem) => boolean;
}> = memo(({ item, itemsMap, onClick, isExpanded }) => {
    const children = itemsMap.get(item.id) || [];
    const hasChildren = children.length > 0;

    return (
        <div>
            <div key={item.id} style={{ display: 'flex' }}>
                <div style={{ width: item.level * 20, height: 10 }} />
                <button onClick={hasChildren ? onClick(item) : undefined} aria-expanded={isExpanded(item)}>
                    <span>{hasChildren && (isExpanded(item) ? '▼' : '▶︎')}</span>
                    <span style={{ marginLeft: hasChildren ? 10 : 18 }}>{item.name}</span>
                </button>
            </div>
            {isExpanded(item) &&
                children.map((child) => (
                    <RenderItem
                        key={child.id}
                        item={child}
                        itemsMap={itemsMap}
                        onClick={onClick}
                        isExpanded={isExpanded}
                    />
                ))}
        </div>
    );
});

export const TableOfContents: FC<TableOfContentsProps> = ({ itemsMap, onClick, isExpanded, expandAll, closeAll }) => {
    const [allExpanded, setAllExpanded] = useState(false);

    const handleExpandCollapseAll = useCallback(() => {
        if (allExpanded) {
            closeAll();
        } else {
            expandAll();
        }
        setAllExpanded(!allExpanded);
    }, [allExpanded, expandAll, closeAll]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 18 }}>
                <button onClick={handleExpandCollapseAll}>
                    {allExpanded ? <span>Sbalit vše</span> : <span>Rozbalit vše</span>}
                </button>
            </div>
            <div>
                {(itemsMap.get('') || []).map((item) => (
                    <RenderItem
                        key={item.id}
                        item={item}
                        itemsMap={itemsMap}
                        onClick={onClick}
                        isExpanded={isExpanded}
                    />
                ))}
            </div>
        </div>
    );
};
