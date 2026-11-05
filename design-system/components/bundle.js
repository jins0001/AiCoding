/* @ds-bundle: {"format":4,"namespace":"Epoch","components":[{"name":"Button"},{"name":"StatusChip"},{"name":"MetricTile"},{"name":"EpochProgress"},{"name":"LogConsole"},{"name":"ChainNode"},{"name":"CodeCell"},{"name":"ParamField"},{"name":"DataTable"}]} */
/* Epoch component bundle. Plain DOM, no framework: each component is a function that takes a props object and returns an HTMLElement. */
(function () {
  'use strict';

  function h(tag, props) {
    var el = document.createElement(tag);
    props = props || {};
    for (var k in props) {
      var v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k in el && typeof v !== 'object') { try { el[k] = v; } catch (e) { el.setAttribute(k, v); } }
      else el.setAttribute(k, v);
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---- Button ---- */
  function Button(p) {
    p = p || {};
    var size = p.size || 'md', variant = p.variant || 'secondary';
    var btn = h('button', {
      type: p.type || 'button',
      class: cx('ep-btn', 'ep-btn--' + variant, size !== 'md' && 'ep-btn--' + size, p.className),
      disabled: !!(p.disabled || p.loading),
      'aria-busy': p.loading ? 'true' : null,
      onClick: p.onClick
    });
    if (p.loading) btn.appendChild(h('span', { class: 'ep-spin', 'aria-hidden': 'true' }));
    else if (p.glyph) btn.appendChild(h('span', { class: 'ep-btn__glyph', 'aria-hidden': 'true' }, p.glyph));
    btn.appendChild(h('span', null, p.label || ''));
    return btn;
  }

  /* ---- StatusChip ---- */
  var STATUS = {
    queued:    { ko: '대기',    en: 'Queued',    glyph: null },
    running:   { ko: '실행 중', en: 'Running',   glyph: null },
    succeeded: { ko: '완료',    en: 'Succeeded', glyph: '✓' },
    failed:    { ko: '실패',    en: 'Failed',    glyph: '✕' },
    stopped:   { ko: '중지',    en: 'Stopped',   glyph: null },
    draft:     { ko: '초안',    en: 'Draft',     glyph: null }
  };
  function StatusChip(p) {
    p = p || {};
    var s = STATUS[p.status] ? p.status : 'queued', d = STATUS[s];
    var mark = d.glyph
      ? h('span', { class: 'ep-chip__glyph', 'aria-hidden': 'true' }, d.glyph)
      : h('span', { class: 'ep-chip__dot', 'aria-hidden': 'true' });
    return h('span', { class: cx('ep-chip', 'ep-chip--' + s, p.className), role: 'status' },
      mark, h('span', null, p.label || (p.lang === 'en' ? d.en : d.ko)));
  }

  /* ---- MetricTile ---- */
  var SVG = 'http://www.w3.org/2000/svg';
  function sparkline(series) {
    var w = 160, ht = 28, n = series.length;
    if (n < 2) return null;
    var min = Math.min.apply(null, series), max = Math.max.apply(null, series), span = (max - min) || 1;
    var pts = series.map(function (v, i) {
      return (1 + i * (w - 2) / (n - 1)).toFixed(1) + ',' + (ht - 2 - (v - min) / span * (ht - 4)).toFixed(1);
    }).join(' ');
    var svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + ht);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('class', 'ep-metric__spark');
    svg.setAttribute('aria-hidden', 'true');
    var pl = document.createElementNS(SVG, 'polyline');
    pl.setAttribute('points', pts);
    svg.appendChild(pl);
    return svg;
  }
  function MetricTile(p) {
    p = p || {};
    var tone = p.deltaTone || 'neutral';
    return h('div', { class: cx('ep-metric', p.className) },
      h('div', { class: 'ep-metric__label' }, p.label || ''),
      h('div', { class: 'ep-metric__row' },
        h('span', { class: 'ep-metric__value' }, p.value == null ? '—' : p.value),
        p.unit ? h('span', { class: 'ep-metric__unit' }, p.unit) : null,
        p.delta != null ? h('span', { class: cx('ep-metric__delta', tone !== 'neutral' && 'ep-metric__delta--' + tone) }, p.delta) : null),
      p.series ? sparkline(p.series) : null,
      p.note ? h('div', { class: 'ep-metric__note' }, p.note) : null);
  }

  /* ---- EpochProgress ---- */
  function EpochProgress(p) {
    p = p || {};
    var epochs = Math.max(1, (p.epochs | 0) || 1);
    var epoch = Math.min(epochs, Math.max(0, +p.epoch || 0));
    var steps = Math.max(1, (p.steps | 0) || 1);
    var step = Math.min(steps, Math.max(0, +p.step || 0));
    var status = p.status || 'running';
    var done = status === 'succeeded' ? epochs : Math.max(0, epoch - 1) + step / steps;
    var pct = Math.round(done / epochs * 100);
    var track = h('div', { class: 'ep-progress__track', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct), 'aria-label': 'Epoch ' + epoch + ' / ' + epochs });
    var segs = Math.min(epochs, 50);
    for (var i = 0; i < segs; i++) {
      var fill = Math.max(0, Math.min(1, done * segs / epochs - i));
      track.appendChild(h('div', { class: 'ep-progress__seg' }, h('i', { style: { width: (fill * 100).toFixed(1) + '%' } })));
    }
    var meta = [];
    if (p.loss != null) meta.push(h('span', null, 'loss ', h('b', null, p.loss)));
    if (p.acc != null) meta.push(h('span', null, 'acc ', h('b', null, p.acc)));
    if (p.lr != null) meta.push(h('span', null, 'lr ', h('b', null, p.lr)));
    if (p.eta) meta.push(h('span', null, 'ETA ', h('b', null, p.eta)));
    return h('div', { class: cx('ep-progress', 'ep-progress--' + status, p.className) },
      h('div', { class: 'ep-progress__head' },
        h('span', { class: 'ep-progress__title' }, p.title || ('Epoch ' + epoch + ' / ' + epochs)),
        h('span', { class: 'ep-progress__count' }, status === 'succeeded' ? pct + '%' : 'step ' + step + ' / ' + steps)),
      track,
      meta.length ? h('div', { class: 'ep-progress__meta' }, meta) : null);
  }

  /* ---- LogConsole ---- */
  function LogConsole(p) {
    p = p || {};
    var body = h('pre', { class: 'ep-log__body', style: { maxHeight: (p.height || 160) + 'px' }, tabindex: '0', role: 'log', 'aria-label': p.title || 'log' });
    (p.lines || []).forEach(function (l) {
      var lvl = String(l.level || 'INFO').toUpperCase();
      body.appendChild(h('div', { class: 'ep-log__line ep-log__line--' + lvl },
        l.t ? h('span', { class: 'ep-log__t' }, l.t) : null,
        h('span', { class: 'ep-log__lvl' }, lvl),
        h('span', { class: 'ep-log__msg' }, l.msg || '')));
    });
    var head = h('div', { class: 'ep-log__head' },
      h('span', { class: 'ep-log__title' }, p.title || 'log'),
      p.status ? StatusChip({ status: p.status }) : null);
    if (p.follow !== false && typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () { body.scrollTop = body.scrollHeight; });
    }
    return h('div', { class: cx('ep-log', p.className) }, head, body);
  }

  /* ---- ChainNode ---- */
  var KIND = { prompt: '프롬프트', llm: 'LLM', tool: '도구', retriever: '리트리버', parser: '파서', memory: '메모리' };
  function ChainNode(p) {
    p = p || {};
    var kind = KIND[p.kind] ? p.kind : 'prompt';
    var st = p.status && STATUS[p.status] ? p.status : null;
    var node = h('div', {
      class: cx('ep-node', p.selected && 'ep-node--selected', p.className),
      tabindex: '0', role: 'group',
      'aria-label': (p.name || '') + ' (' + (p.kindLabel || KIND[kind]) + ')' + (st ? ', ' + STATUS[st].ko : ''),
      onClick: p.onSelect
    },
      h('div', { class: 'ep-node__head' },
        h('span', { class: cx('ep-node__kind', 'ep-node__kind--' + kind) }, p.kindLabel || KIND[kind]),
        st ? h('span', { class: 'ep-node__status ep-node__status--' + st }, STATUS[st].ko) : null),
      h('div', { class: 'ep-node__name', title: p.name || '' }, p.name || ''),
      p.meta ? h('div', { class: 'ep-node__meta', title: p.meta }, p.meta) : null);
    if (p.input !== false) node.appendChild(h('span', { class: 'ep-node__port ep-node__port--in', 'aria-hidden': 'true' }));
    if (p.output !== false) node.appendChild(h('span', { class: 'ep-node__port ep-node__port--out', 'aria-hidden': 'true' }));
    return node;
  }
  function chainEdge() { return h('span', { class: 'ep-edge', 'aria-hidden': 'true' }); }
  function chain(nodes) {
    var row = h('div', { class: 'ep-chain' });
    (nodes || []).forEach(function (n, i) {
      if (i) row.appendChild(chainEdge());
      row.appendChild(n.nodeType ? n : ChainNode(n));
    });
    return row;
  }

  /* ---- CodeCell ---- */
  var PY_KW = /\b(?:import|from|as|def|class|return|for|in|if|elif|else|while|with|lambda|try|except|finally|raise|pass|break|continue|and|or|not|is|None|True|False|yield|global|async|await)\b/g;
  var PY_TOK = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|[rbfu]{0,2}"(?:\\.|[^"\\\n])*"|[rbfu]{0,2}'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/g;
  function plain(s) { return esc(s).replace(PY_KW, '<span class="ep-tok-kw">$&</span>'); }
  function highlightPython(src) {
    var out = '', last = 0, m;
    PY_TOK.lastIndex = 0;
    while ((m = PY_TOK.exec(src))) {
      out += plain(src.slice(last, m.index));
      if (m[1]) out += '<span class="ep-tok-cm">' + esc(m[1]) + '</span>';
      else if (m[2]) out += '<span class="ep-tok-str">' + esc(m[2]) + '</span>';
      else out += '<span class="ep-tok-num">' + esc(m[3]) + '</span>';
      last = PY_TOK.lastIndex;
    }
    return out + plain(src.slice(last));
  }
  function highlightPrompt(src) {
    return esc(src).replace(/\{[A-Za-z_][\w.]*\}/g, '<span class="ep-tok-var">$&</span>');
  }
  function CodeCell(p) {
    p = p || {};
    var kind = p.kind === 'prompt' ? 'prompt' : 'code';
    var status = p.status || 'idle';
    var idx = p.index == null ? ' ' : p.index;
    var inLabel = status === 'running' ? 'In [*]:' : 'In [' + idx + ']:';
    var cell = h('div', { class: cx('ep-cell', 'ep-cell--' + kind, 'ep-cell--' + status, p.className) });
    if (p.title) cell.appendChild(h('div', { class: 'ep-cell__bar' }, h('span', null, p.title), p.lang ? h('span', { class: 'ep-cell__lang' }, p.lang) : null));
    cell.appendChild(h('div', { class: 'ep-cell__gutter' }, kind === 'prompt' ? 'prompt' : inLabel));
    cell.appendChild(h('pre', { class: 'ep-cell__src', html: kind === 'prompt' ? highlightPrompt(p.code || '') : highlightPython(p.code || '') }));
    if (p.output != null) {
      cell.appendChild(h('div', { class: 'ep-cell__gutter ep-cell__gutter--out' }, kind === 'prompt' ? 'out' : 'Out [' + idx + ']:'));
      cell.appendChild(h('pre', { class: 'ep-cell__out' }, p.output));
    }
    return cell;
  }

  /* ---- ParamField ---- */
  var uid = 0;
  function ParamField(p) {
    p = p || {};
    var id = p.id || ('ep-f' + (++uid));
    var kind = p.kind || 'text';
    var input;
    if (kind === 'select') {
      input = h('select', { class: 'ep-field__input', id: id, disabled: !!p.disabled, onChange: p.onChange });
      (p.options || []).forEach(function (o) {
        var v = typeof o === 'object' ? o.value : o, l = typeof o === 'object' ? o.label : o;
        input.appendChild(h('option', { value: v, selected: String(v) === String(p.value) }, l));
      });
    } else {
      input = h('input', {
        class: 'ep-field__input', id: id,
        type: kind === 'number' ? 'text' : kind,
        inputmode: kind === 'number' ? 'decimal' : null,
        value: p.value == null ? '' : p.value,
        placeholder: p.placeholder,
        disabled: !!p.disabled,
        'aria-invalid': p.error ? 'true' : null,
        'aria-describedby': (p.hint || p.error) ? id + '-hint' : null,
        onInput: p.onInput, onChange: p.onChange
      });
    }
    var msg = p.error || p.hint;
    return h('div', { class: cx('ep-field', p.error && 'ep-field--error', p.disabled && 'ep-field--disabled', p.className) },
      h('label', { class: 'ep-field__label', htmlFor: id },
        h('span', null, p.label || p.name || ''),
        p.name && p.label ? h('span', { class: 'ep-field__name' }, p.name) : null),
      h('div', { class: 'ep-field__ctl' },
        input,
        p.unit ? h('span', { class: 'ep-field__unit' }, p.unit) : null,
        kind === 'select' ? h('span', { class: 'ep-field__unit', 'aria-hidden': 'true' }, '▾') : null),
      msg ? h('div', { class: 'ep-field__hint', id: id + '-hint' }, msg) : null);
  }

  /* ---- DataTable ---- */
  function fmt(v, col) {
    if (v != null && v.nodeType) return v;
    if (typeof col.format === 'function') return col.format(v);
    if (typeof v === 'number' && col.digits != null) return v.toFixed(col.digits);
    return v == null ? '' : v;
  }
  function DataTable(p) {
    p = p || {};
    var cols = p.columns || [], rows = p.rows || [], maxes = {};
    cols.forEach(function (c) {
      if (!c.highlightMax) return;
      var m = -Infinity;
      rows.forEach(function (r) { if (typeof r[c.key] === 'number' && r[c.key] > m) m = r[c.key]; });
      maxes[c.key] = m;
    });
    var table = h('table', { class: 'ep-table' });
    if (p.caption) table.appendChild(h('caption', null, p.caption));
    table.appendChild(h('thead', null, h('tr', null, cols.map(function (c) {
      return h('th', { scope: 'col', class: c.align === 'num' ? 'num' : null }, c.label || c.key);
    }))));
    table.appendChild(h('tbody', null, rows.map(function (r) {
      return h('tr', null, cols.map(function (c) {
        var v = r[c.key];
        var isMax = c.highlightMax && typeof v === 'number' && v === maxes[c.key];
        return h(c.rowHeader ? 'th' : 'td', { scope: c.rowHeader ? 'row' : null, class: cx(c.align === 'num' && 'num', isMax && 'ep-max') || null }, fmt(v, c));
      }));
    })));
    if (p.footer) table.appendChild(h('tfoot', null, h('tr', null, cols.map(function (c) {
      return h('td', { class: c.align === 'num' ? 'num' : null }, fmt(p.footer[c.key], c));
    }))));
    return h('div', { class: cx('ep-table-wrap', p.className) }, table);
  }

  var api = {
    Button: Button, StatusChip: StatusChip, MetricTile: MetricTile, EpochProgress: EpochProgress,
    LogConsole: LogConsole, ChainNode: ChainNode, CodeCell: CodeCell, ParamField: ParamField, DataTable: DataTable,
    chain: chain, chainEdge: chainEdge, h: h, STATUS: STATUS, KIND: KIND
  };
  window.Epoch = Object.assign(window.Epoch || {}, api);
})();
