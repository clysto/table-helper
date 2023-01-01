import m from 'mithril';
import 'bulma/css/bulma.css';
import './style.css';
import logo from './logo';

function splitByNumber(str, num) {
  return str.match(new RegExp('.{1,' + num + '}', 'g'));
}

function App() {
  const rows = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];
  let currentRow = rows.length - 1;
  let n = localStorage.getItem('n') ? JSON.parse(localStorage.getItem('n')) : 3;

  const addRow = () => {
    const row = document.getElementById('row-input').value;
    if (!row) {
      return;
    }
    rows.splice(currentRow + 1, 0, row);
    currentRow = currentRow + 1;
    document.getElementById('row-input').value = '';
    localStorage.setItem('data', JSON.stringify(rows));
  };

  const removeRow = () => {
    rows.splice(currentRow, 1);
    currentRow = currentRow - 1;
    localStorage.setItem('data', JSON.stringify(rows));
  };

  const handleNChange = (value) => {
    n = value;
    localStorage.setItem('n', JSON.stringify(n));
  };

  const genTable = () => {
    let table = rows.map((row, index) => {
      const cols = splitByNumber(row, n);
      return m(
        'tr',
        { class: index === currentRow ? 'has-background-warning-light' : '', onclick: () => (currentRow = index) },
        cols.map((col) => m('td', col))
      );
    });
    const maxCols = Math.max.apply(
      null,
      table.map((row) => row.children.length)
    );
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      for (let j = row.children.length; j < maxCols; j++) {
        row.children.push(m('td'));
      }
    }
    return table;
  };

  return {
    view: () => [
      m('div', { id: 'app' }, [
        m('div', { class: 'logo' }, m.trust(logo)),
        m('div', { class: 'box table-control' }, [
          m('div', { class: 'field has-addons' }, [
            m('p', { class: 'control' }, [
              m('div', { class: 'select' }, [
                m('select', { name: 'split-type' }, [m('option', { value: 'char-num' }, '按照字符个数分割')]),
              ]),
            ]),
            m('p', { class: 'control is-expanded' }, [
              m('input', {
                type: 'number',
                id: 'split-num',
                value: n,
                class: 'input',
                onchange: (e) => handleNChange(parseInt(e.target.value)),
              }),
            ]),
          ]),
          m('div', { class: 'field ' }, [
            m('input', {
              type: 'text',
              id: 'row-input',
              class: 'input',
              placeholder: '行内容',
              onkeypress: (e) => {
                if (e.key === 'Enter') {
                  addRow();
                }
              },
            }),
          ]),
          m('div', { class: 'field is-grouped is-grouped-right' }, [
            m('p', { class: 'control' }, [m('button', { class: 'button is-primary', onclick: addRow }, '添加行')]),
            m('p', { class: 'control' }, [m('button', { class: 'button is-danger', onclick: removeRow }, '删除行')]),
          ]),
        ]),
        m('div', { class: 'table-container' }, [
          m('table', { class: 'table is-bordered is-striped is-narrow is-hoverable is-fullwidth' }, [
            rows.length ? m('tbody', genTable()) : null,
          ]),
        ]),
        m('footer', [
          m('hr'),
          m(
            'p',
            { class: 'has-text-centered is-family-monospace has-text-grey' },
            'Made by Yachen with ❤️. © 2022-2023.'
          ),
        ]),
      ]),
    ],
  };
}

m.mount(document.body, App);
