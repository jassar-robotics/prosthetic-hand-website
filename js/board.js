const columnsRoot = document.querySelector('[data-board-columns]');
const errorMessage = document.querySelector('[data-board-error]');

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
};

const renderBoard = (data) => {
  if (!columnsRoot || !data || !Array.isArray(data.columns)) {
    throw new Error('Invalid board data');
  }

  columnsRoot.innerHTML = '';

  data.columns.forEach((columnData) => {
    const column = createElement('section', 'board-column');
    column.dataset.accent = columnData.accent || 'sand';

    const header = createElement('div', 'board-column-header');
    const pill = createElement('span', 'board-column-pill', columnData.title || 'Untitled');
    const count = createElement('span', 'board-column-count', String((columnData.items || []).length));

    header.appendChild(pill);
    header.appendChild(count);
    column.appendChild(header);

    if (!columnData.items || columnData.items.length === 0) {
      column.appendChild(createElement('div', 'board-empty', 'No items yet.'));
    } else {
      columnData.items.forEach((item) => {
        const card = createElement('article', 'board-card');
        const title = createElement('div', 'board-card-title', item.title || 'Untitled task');
        const meta = createElement('div', 'board-card-meta');

        if (item.priority) {
          const priority = createElement('span', 'board-chip board-chip--priority', item.priority);
          priority.dataset.level = item.priority;
          meta.appendChild(priority);
        }

        if (item.owner) {
          meta.appendChild(createElement('span', 'board-chip board-chip--owner', item.owner));
        }

        if (item.date) {
          meta.appendChild(createElement('span', 'board-chip board-chip--date', item.date));
        }

        card.appendChild(title);
        card.appendChild(meta);
        column.appendChild(card);
      });
    }

    columnsRoot.appendChild(column);
  });
};

fetch('data/board-data.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to load board data');
    }
    return response.json();
  })
  .then((data) => {
    renderBoard(data);
  })
  .catch((error) => {
    console.error(error);
    if (errorMessage) {
      errorMessage.hidden = false;
    }
  });
