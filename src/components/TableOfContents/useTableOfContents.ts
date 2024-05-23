import { useState, useCallback, useMemo } from 'react';
import { ContentItem } from './types/ContentItem.ts';

type TableOfContentsArg = {
    items: ContentItem[];
};

export const useTableOfContents = ({ items }: TableOfContentsArg) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    // map for quicker access to children
    const itemsMap = useMemo(() => {
        const map = new Map<string, ContentItem[]>();
        items.forEach((item) => {
            const parentId = item.parentId ?? '';
            if (!map.has(parentId)) {
                map.set(parentId, []);
            }
            const children = map.get(parentId);
            if (children) {
                children.push(item);
            }
        });
        return map;
    }, [items]);

    // stack to convert recursive logic to iterative
    const getDescendants = useCallback(
        (itemId: string): string[] => {
            const descendants: string[] = [];
            const stack: (string | undefined)[] = [itemId];

            while (stack.length > 0) {
                const currentId = stack.pop();
                if (currentId !== undefined) {
                    const children = itemsMap.get(currentId) || [];
                    children.forEach((child) => {
                        descendants.push(child.id);
                        stack.push(child.id);
                    });
                }
            }

            return descendants;
        },
        [itemsMap]
    );

    const toggleItem = useCallback(
        (item: ContentItem) => {
            setExpandedItems((prevExpandedItems) => {
                const newExpandedItems = new Set(prevExpandedItems);
                if (newExpandedItems.has(item.id)) {
                    newExpandedItems.delete(item.id);
                    const descendants = getDescendants(item.id);
                    descendants.forEach((descendant) => newExpandedItems.delete(descendant));
                } else {
                    newExpandedItems.add(item.id);
                }
                return newExpandedItems;
            });
        },
        [getDescendants]
    );

    const isExpanded = useCallback((item: ContentItem) => expandedItems.has(item.id), [expandedItems]);

    const onClick = useCallback((item: ContentItem) => () => toggleItem(item), [toggleItem]);

    const expandAll = useCallback(() => {
        setExpandedItems(new Set(items.map((item) => item.id)));
    }, [items]);

    const closeAll = useCallback(() => {
        setExpandedItems(new Set());
    }, []);

    return { itemsMap, onClick, isExpanded, expandAll, closeAll };
};
