// Collapsible Navigation for SUMMARY page
document.addEventListener('DOMContentLoaded', function () {
    // Make nested lists collapsible
    const makeCollapsible = () => {
        // Find all list items that contain nested lists
        const listItems = document.querySelectorAll('.md-content ul > li');

        listItems.forEach(item => {
            const nestedList = item.querySelector('ul');

            if (nestedList) {
                // Create toggle button
                const toggle = document.createElement('span');
                toggle.className = 'toc-toggle';
                toggle.innerHTML = '▼';
                toggle.style.cssText = `
          cursor: pointer;
          margin-right: 0.5rem;
          color: var(--md-primary-fg-color, #6B4C9A);
          font-size: 0.8em;
          display: inline-block;
          transition: transform 0.2s;
          user-select: none;
        `;

                // Insert toggle before the first text node
                const firstChild = item.firstChild;
                item.insertBefore(toggle, firstChild);

                // Initially collapse nested lists
                nestedList.style.display = 'none';
                toggle.style.transform = 'rotate(-90deg)';
                item.classList.add('collapsed');

                // Toggle on click
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();

                    if (item.classList.contains('collapsed')) {
                        nestedList.style.display = 'block';
                        toggle.style.transform = 'rotate(0deg)';
                        item.classList.remove('collapsed');
                    } else {
                        nestedList.style.display = 'none';
                        toggle.style.transform = 'rotate(-90deg)';
                        item.classList.add('collapsed');
                    }
                });
            }
        });
    };

    // Run on page load
    makeCollapsible();

    // Add search and filter functionality on SUMMARY page
    const addSearchAndFilters = () => {
        const content = document.querySelector('.md-content');
        if (!content) return;

        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.style.cssText = `
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    `;

        // Create search box
        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = 'Search documentation...';
        searchBox.style.cssText = `
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-family: 'Poppins', Arial, sans-serif;
      font-size: 0.95rem;
    `;

        // Create filter row
        const filterRow = document.createElement('div');
        filterRow.style.cssText = `
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
    `;

        // Category filter
        const categoryLabel = document.createElement('label');
        categoryLabel.textContent = 'Category:';
        categoryLabel.style.cssText = `
      font-weight: 500;
      color: #3C3228;
    `;

        const categorySelect = document.createElement('select');
        categorySelect.style.cssText = `
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-family: 'Poppins', Arial, sans-serif;
      background: white;
    `;

        const categories = ['All Categories', 'Controllers', 'Services', 'Entities', 'Repositories', 'Commands', 'Events', 'Plugins', 'Other'];
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat === 'All Categories' ? '' : cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });

        // Repository filter
        const repoLabel = document.createElement('label');
        repoLabel.textContent = 'Repository:';
        repoLabel.style.cssText = `
      font-weight: 500;
      color: #3C3228;
      margin-left: 1rem;
    `;

        const repoSelect = document.createElement('select');
        repoSelect.style.cssText = `
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-family: 'Poppins', Arial, sans-serif;
      background: white;
    `;

        const repos = ['All Repositories', 'Backend', 'Frontend', 'CMS'];
        repos.forEach(repo => {
            const option = document.createElement('option');
            option.value = repo === 'All Repositories' ? '' : repo.toLowerCase();
            option.textContent = repo;
            repoSelect.appendChild(option);
        });

        // Clear filters button
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Filters';
        clearButton.style.cssText = `
      padding: 0.5rem 1rem;
      background-color: #3C3228;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Poppins', Arial, sans-serif;
      margin-left: auto;
    `;

        clearButton.onclick = () => {
            searchBox.value = '';
            categorySelect.value = '';
            repoSelect.value = '';
            filterContent();
        };

        // Assemble filter row
        filterRow.appendChild(categoryLabel);
        filterRow.appendChild(categorySelect);
        filterRow.appendChild(repoLabel);
        filterRow.appendChild(repoSelect);
        filterRow.appendChild(clearButton);

        // Assemble filter container
        filterContainer.appendChild(searchBox);
        filterContainer.appendChild(filterRow);

        // Filter function
        const filterContent = () => {
            const searchTerm = searchBox.value.toLowerCase();
            const selectedCategory = categorySelect.value.toLowerCase();
            const selectedRepo = repoSelect.value.toLowerCase();

            // Get all h2 sections (Controllers, Services, etc.)
            const sections = content.querySelectorAll('h2');

            sections.forEach(section => {
                const sectionTitle = section.textContent.toLowerCase();
                const sectionContent = section.nextElementSibling;

                // Check if section matches category filter
                const categoryMatch = !selectedCategory || sectionTitle.includes(selectedCategory);

                if (sectionContent && sectionContent.tagName === 'UL') {
                    let hasVisibleItems = false;

                    // Filter list items
                    const items = sectionContent.querySelectorAll('li');
                    items.forEach(item => {
                        const text = item.textContent.toLowerCase();
                        const link = item.querySelector('a');
                        const linkHref = link ? link.getAttribute('href') : '';

                        // Check search match
                        const searchMatch = !searchTerm || text.includes(searchTerm);

                        // Check repository match (based on file path patterns)
                        let repoMatch = !selectedRepo;
                        if (selectedRepo && linkHref) {
                            if (selectedRepo === 'backend' && linkHref.includes('src_')) repoMatch = true;
                            if (selectedRepo === 'frontend' && linkHref.includes('api_')) repoMatch = true;
                            if (selectedRepo === 'cms' && linkHref.includes('cms_')) repoMatch = true;
                        }

                        // Show/hide item
                        if (searchMatch && categoryMatch && repoMatch) {
                            item.style.display = '';
                            hasVisibleItems = true;
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    // Show/hide section
                    if (hasVisibleItems && categoryMatch) {
                        section.style.display = '';
                        sectionContent.style.display = '';
                    } else {
                        section.style.display = 'none';
                        sectionContent.style.display = 'none';
                    }
                }
            });
        };

        // Add event listeners
        searchBox.addEventListener('input', filterContent);
        categorySelect.addEventListener('change', filterContent);
        repoSelect.addEventListener('change', filterContent);

        // Insert filter container
        const firstHeading = content.querySelector('h1');
        if (firstHeading && firstHeading.nextSibling) {
            firstHeading.parentNode.insertBefore(filterContainer, firstHeading.nextSibling);
        }
    };

    // Add "Expand All" / "Collapse All" buttons
    const addExpandCollapseButtons = () => {
        const content = document.querySelector('.md-content');
        if (!content) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
      margin-bottom: 1rem;
      display: flex;
      gap: 0.5rem;
    `;

        const expandAll = document.createElement('button');
        expandAll.textContent = 'Expand All';
        expandAll.className = 'md-button md-button--primary';
        expandAll.style.cssText = `
      background-color: #6B4C9A;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    `;

        const collapseAll = document.createElement('button');
        collapseAll.textContent = 'Collapse All';
        collapseAll.className = 'md-button';
        collapseAll.style.cssText = `
      background-color: #3C3228;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    `;

        expandAll.addEventListener('click', () => {
            document.querySelectorAll('.md-content ul ul').forEach(ul => {
                if (ul.style.display !== 'none') {
                    ul.style.display = 'block';
                }
            });
            document.querySelectorAll('.toc-toggle').forEach(toggle => {
                if (toggle.parentElement.style.display !== 'none') {
                    toggle.style.transform = 'rotate(0deg)';
                    toggle.parentElement.classList.remove('collapsed');
                }
            });
        });

        collapseAll.addEventListener('click', () => {
            document.querySelectorAll('.md-content ul ul').forEach(ul => {
                ul.style.display = 'none';
            });
            document.querySelectorAll('.toc-toggle').forEach(toggle => {
                toggle.style.transform = 'rotate(-90deg)';
                toggle.parentElement.classList.add('collapsed');
            });
        });

        buttonContainer.appendChild(expandAll);
        buttonContainer.appendChild(collapseAll);

        // Find filter container and insert after it
        const filterContainer = content.querySelector('div');
        if (filterContainer && filterContainer.nextSibling) {
            filterContainer.parentNode.insertBefore(buttonContainer, filterContainer.nextSibling);
        }
    };

    // Add features if on SUMMARY page
    if (window.location.pathname.includes('SUMMARY')) {
        addSearchAndFilters();
        addExpandCollapseButtons();
    }

    // Add "Back to Index" button on all document pages
    const addBackToIndexButton = () => {
        // Don't add on home, SUMMARY, or explorer pages
        if (window.location.pathname.endsWith('/') ||
            window.location.pathname.includes('SUMMARY') ||
            window.location.pathname.includes('explorer') ||
            window.location.pathname.includes('index.html')) {
            return;
        }

        const content = document.querySelector('.md-content__inner');
        if (!content) return;

        // Create back button container
        const backButtonContainer = document.createElement('div');
        backButtonContainer.style.cssText = `
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
    `;

        // Create back button
        const backButton = document.createElement('a');
        backButton.href = '../SUMMARY/';
        backButton.innerHTML = '← Back to Documentation Index';
        backButton.style.cssText = `
      display: inline-block;
      background-color: #6B4C9A;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      font-family: 'Poppins', Arial, sans-serif;
      transition: all 0.3s ease;
    `;

        backButton.onmouseover = () => {
            backButton.style.backgroundColor = '#4B2C7A';
            backButton.style.transform = 'translateY(-2px)';
            backButton.style.boxShadow = '0 4px 12px rgba(107, 76, 154, 0.3)';
        };

        backButton.onmouseout = () => {
            backButton.style.backgroundColor = '#6B4C9A';
            backButton.style.transform = 'translateY(0)';
            backButton.style.boxShadow = 'none';
        };

        backButtonContainer.appendChild(backButton);

        // Insert at the top of content
        const firstElement = content.firstElementChild;
        if (firstElement) {
            content.insertBefore(backButtonContainer, firstElement);
        }

        // Also add at the bottom
        const bottomBackButton = backButtonContainer.cloneNode(true);
        bottomBackButton.style.borderBottom = 'none';
        bottomBackButton.style.borderTop = '2px solid #e2e8f0';
        bottomBackButton.style.paddingTop = '1rem';
        bottomBackButton.style.paddingBottom = '0';

        // Re-add event listeners to cloned button
        const bottomBtn = bottomBackButton.querySelector('a');
        bottomBtn.onmouseover = backButton.onmouseover;
        bottomBtn.onmouseout = backButton.onmouseout;

        content.appendChild(bottomBackButton);
    };

    // Add back button on document pages
    addBackToIndexButton();
});
