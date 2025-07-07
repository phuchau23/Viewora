'use client'

import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { useRouter, useSearchParams } from 'next/navigation';
import React from "react";

interface MenuItem {
  id: string;
  label: string;
  content?: string;
  filePath: string;
}

const initialMenuItems: MenuItem[] = [
  {
    id: 'terms-and-conditions',
    label: 'Terms & Conditions',
    filePath: '/policy/terms-and-conditions.txt',
  },
  {
    id: 'privacy-policy',
    label: 'Privacy Policy',
    filePath: '/policy/privacy-policy.txt',
  },
  {
    id: 'refund-policy',
    label: 'Refund Policy',
    filePath: '/policy/refund-policy.txt',
  },
];

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [selectedItem, setSelectedItem] = useState<string>(''); // Initialize with empty string
  const [currentContent, setCurrentContent] = useState<string>('Loading content...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const policyParam = searchParams.get('policy');
    if (policyParam) {
      const isValidItem = initialMenuItems.some(item => item.id === policyParam);
      if (isValidItem) {
        setSelectedItem(policyParam);
      } else {
        setSelectedItem(initialMenuItems[0].id);
        router.replace(`?policy=${initialMenuItems[0].id}`);
      }
    } else {
      setSelectedItem(initialMenuItems[0].id);
      router.replace(`?policy=${initialMenuItems[0].id}`);
    }
  }, [searchParams, router]);

  const fetchContent = async (itemId: string) => {
    setIsLoading(true);
    setError(null);
    const itemToFetch = menuItems.find(item => item.id === itemId);

    if (!itemToFetch) {
      setCurrentContent('Menu item not found.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(itemToFetch.filePath);
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.statusText} (Status: ${response.status})`);
      }
      const textContent = await response.text();
      setCurrentContent(textContent);
    } catch (err: any) {
      console.error("Error fetching content:", err);
      setError(`Failed to load content. ${err.message}`);
      setCurrentContent('Could not load content.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      fetchContent(selectedItem);
    }
  }, [selectedItem, menuItems]);

  const handleMenuItemClick = (itemId: string) => {
    setSelectedItem(itemId);
    router.push(`?policy=${itemId}`);
  };

  const handlePrint = () => {
    const printableContent = document.getElementById('printable-content');
    if (printableContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        // Set the new window's location to reflect the original address
        printWindow.location.href = window.location.href;

        // Add "Viewora's" before currentTitle in the print tab name
        printWindow.document.write('<html><head><title>Viewora\'s ' + currentTitle + '</title>');
        // Optionally, include basic styles for printing
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { font-family: sans-serif; margin: 20px; }
          .prose { max-width: 800px; margin: 0 auto; }
          h1, h2, h3, h4, h5, h6 { margin-top: 1em; margin-bottom: 0.5em; }
          p { margin-bottom: 1em; line-height: 1.6; }
          pre, code { background-color: #f0f0f0; padding: 2px 4px; border-radius: 4px; }
          pre { display: block; padding: 10px; overflow-x: auto; }
          /* Centered title for print */
          .print-title { text-align: center; margin-bottom: 20px; }
        `);
        printWindow.document.write('</style></head><body>');
        // Modified line: Add "Viewora's" before currentTitle in the visible print title
        printWindow.document.write(`<h1 class="print-title">Viewora's ${currentTitle}</h1>`); // Apply the centering class
        printWindow.document.write(printableContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Add this event listener to close the tab after print dialog is closed or print is cancelled
        printWindow.onafterprint = function() {
          printWindow.close();
        };

        printWindow.print();
      }
    }
  };

  const currentTitle = menuItems.find(item => item.id === selectedItem)?.label || 'Select an Item';

  return (
    <div className="flex flex-col lg:flex-row bg-background text-foreground min-h-screen">
      {/* Top menu for small screens */}
      {/* Made sticky and added a top-value to account for a global header */}
      <div className="lg:hidden w-full bg-card p-2 shadow-md border-b border-border flex justify-around items-center sticky top-[3.5rem] z-10"> {/* Adjusted top for global header */}
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`
              flex-1 text-center py-2 px-1 text-sm rounded-md transition-colors duration-200 mx-1
              ${selectedItem === item.id
                ? 'text-primary font-semibold' // Selected: bold text in theme color
                : 'text-muted-foreground hover:text-primary'} // Not selected: muted, hover turns text to theme color
            `}
            onClick={() => handleMenuItemClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Sidebar for large screens */}
      <aside className="hidden lg:block w-48 bg-card p-2 shadow-md flex-shrink-0 border-r border-border sticky top-10 h-screen overflow-y-auto light:bg-gray-100">
        <div className="py-4 px-1 text-foreground text-lg font-bold text-center border-b-2 border-primary mb-4 pb-2">
          Website policies
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id} className="mb-2">
                <button
                  className={`
                    w-full text-left p-2 rounded-md transition-colors duration-200
                    ${selectedItem === item.id
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-primary'}
                  `}
                  onClick={() => handleMenuItemClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Adjusted main content padding to account for the sticky top bar on small screens */}
      <main className="flex-grow p-4 lg:p-8 mt-[4rem] lg:mt-0">
        <div className="flex justify-between items-center mb-1 lg:mb-1"> 
          <h1 className="text-l lg:text-l font-bold text-foreground text-left">
            <a href="/" className="text-primary hover:no-underline">Home page</a> &gt; {currentTitle}
          </h1>
          <button
            onClick={handlePrint}
            // Updated classes for theme color
            className="ml-4 px-4 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Print
          </button>
        </div>
        <div id="printable-content" className="bg-card p-4 lg:p-6 rounded-lg shadow-md text-card-foreground">
          {isLoading ? (
            <p className="text-muted-foreground">Loading content...</p>
          ) : error ? (
            <p className="text-destructive">Error: {error}</p>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{currentContent}</ReactMarkdown>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}