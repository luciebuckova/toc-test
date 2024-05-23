import './App.css';
// import { tableOfContentsItems } from './components/TableOfContents/data/tableOfContentsItems.ts';
import { NOZ_TOC_ITEMS_MOCK as tableOfContentsItems } from './components/TableOfContents/data/NOZ_TOC_ITEMS_MOCK.ts';
import { useTableOfContents } from './components/TableOfContents/useTableOfContents.ts';
import { TableOfContents } from './components/TableOfContents/TableOfContents.tsx';

function App() {
    const items = tableOfContentsItems;
    const props = useTableOfContents({ items });

    return (
        <div>
            <TableOfContents {...props} />
        </div>
    );
}

export default App;
