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
                ul.style.display = 'block';
            });
            document.querySelectorAll('.toc-toggle').forEach(toggle => {
                toggle.style.transform = 'rotate(0deg)';
                toggle.parentElement.classList.remove('collapsed');
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

        const firstHeading = content.querySelector('h1, h2');
        if (firstHeading && firstHeading.nextSibling) {
            firstHeading.parentNode.insertBefore(buttonContainer, firstHeading.nextSibling);
        }
    };

    // Add buttons if on SUMMARY page
    if (window.location.pathname.includes('SUMMARY')) {
        addExpandCollapseButtons();
    }

    // Add Previous/Next navigation buttons (W3Schools style)
    const addPrevNextButtons = () => {
        // Get navigation links from sidebar
        const navLinks = Array.from(document.querySelectorAll('.md-nav--primary a.md-nav__link'));
        const currentPath = window.location.pathname;

        // Find current page index
        let currentIndex = -1;
        navLinks.forEach((link, index) => {
            if (link.href && currentPath.includes(link.getAttribute('href'))) {
                currentIndex = index;
            }
        });

        if (currentIndex === -1) return;

        const prevLink = currentIndex > 0 ? navLinks[currentIndex - 1] : null;
        const nextLink = currentIndex < navLinks.length - 1 ? navLinks[currentIndex + 1] : null;

        // Create navigation container
        const createNavButtons = () => {
            const navContainer = document.createElement('div');
            navContainer.className = 'page-navigation';
            navContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 2rem 0;
        padding: 1rem 0;
        border-top: 1px solid #e2e8f0;
      `;

            // Previous button
            if (prevLink) {
                const prevBtn = document.createElement('a');
                prevBtn.href = prevLink.href;
                prevBtn.innerHTML = '❮ Previous';
                prevBtn.className = 'nav-btn nav-btn--prev';
                prevBtn.style.cssText = `
          background-color: #6B4C9A;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          display: inline-block;
        `;
                prevBtn.onmouseover = () => {
                    prevBtn.style.backgroundColor = '#4B2C7A';
                    prevBtn.style.transform = 'translateY(-2px)';
                };
                prevBtn.onmouseout = () => {
                    prevBtn.style.backgroundColor = '#6B4C9A';
                    prevBtn.style.transform = 'translateY(0)';
                };
                navContainer.appendChild(prevBtn);
            } else {
                navContainer.appendChild(document.createElement('div'));
            }

            // Next button
            if (nextLink) {
                const nextBtn = document.createElement('a');
                nextBtn.href = nextLink.href;
                nextBtn.innerHTML = 'Next ❯';
                nextBtn.className = 'nav-btn nav-btn--next';
                nextBtn.style.cssText = `
          background-color: #6B4C9A;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          display: inline-block;
        `;
                nextBtn.onmouseover = () => {
                    nextBtn.style.backgroundColor = '#4B2C7A';
                    nextBtn.style.transform = 'translateY(-2px)';
                };
                nextBtn.onmouseout = () => {
                    nextBtn.style.backgroundColor = '#6B4C9A';
                    nextBtn.style.transform = 'translateY(0)';
                };
                navContainer.appendChild(nextBtn);
            } else {
                navContainer.appendChild(document.createElement('div'));
            }

            return navContainer;
        };

        // Add navigation at top and bottom of content
        const content = document.querySelector('.md-content__inner');
        if (content) {
            // Add at top
            const topNav = createNavButtons();
            const firstElement = content.firstElementChild;
            if (firstElement) {
                content.insertBefore(topNav, firstElement);
            }

            // Add at bottom
            const bottomNav = createNavButtons();
            content.appendChild(bottomNav);
        }
    };

    // Add prev/next buttons on all pages except home
    if (!window.location.pathname.endsWith('/') && !window.location.pathname.includes('index.html')) {
        addPrevNextButtons();
    }
});
