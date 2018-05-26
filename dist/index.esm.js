const DEFAULT_EDITOR_URL = 'https://next.plnkr.co/edit/';
const DEFAULT_EMBED_URL = 'https://embed.plnkr.co';
var EncodingKind;
(function (EncodingKind) {
    EncodingKind["Utf8"] = "utf8";
    EncodingKind["Base64"] = "base64";
})(EncodingKind || (EncodingKind = {}));
var SidebarKind;
(function (SidebarKind) {
    SidebarKind["Preview"] = "tree";
    SidebarKind["Config"] = "config";
})(SidebarKind || (SidebarKind = {}));
var TargetKind;
(function (TargetKind) {
    TargetKind["Blank"] = "_blank";
    TargetKind["Self"] = "_self";
})(TargetKind || (TargetKind = {}));
function buildDynamicEmbedQueryString(options) {
    if (options.show &&
        (!Array.isArray(options.show) ||
            !options.show.every(show => show && typeof show === 'string')))
        throw new TypeError('options.show, if specified, must be an array containing a list of filename fragments and/or "preview"');
    if (options.preview && typeof options.preview !== 'string')
        throw new TypeError('options.preview, if specified, must be a string');
    if (options.sidebar &&
        Object.values(SidebarKind).indexOf(options.sidebar) === -1)
        throw new TypeError(`options.sidebar, if specified, must be one of the following values ${Object.values(SidebarKind).join(', ')}`);
    const query = [];
    if (options.autoCloseSidebar) {
        query.push('autoCloseSidebar');
    }
    else if (options.autoCloseSidebar === false) {
        query.push('autoCloseSidebar=false');
    }
    if (options.deferRun) {
        query.push('deferRun');
    }
    else if (options.deferRun === false) {
        query.push('deferRun=false');
    }
    if (options.preview) {
        query.push(`preview=${encodeURIComponent(options.preview)}`);
    }
    if (options.show) {
        query.push(`show=${options.show.map(encodeURIComponent).join(',')}`);
    }
    if (options.sidebar) {
        query.push(`sidebar=${encodeURIComponent(options.sidebar)}`);
    }
    return query.length ? `?${query.join('&')}` : '';
}
function normalizeProject(projectSpec) {
    if (!Array.isArray(projectSpec.files))
        throw new TypeError('projectSpec.files must be an array');
    if (!projectSpec.files.length)
        throw new TypeError('projectSpec.files must have at least one file');
    if (projectSpec.tags &&
        (!Array.isArray(projectSpec.tags) ||
            !projectSpec.tags.every(tag => typeof tag === 'string')))
        throw new TypeError('projectSpec.tags, if specified, must be an array of strings');
    const files = projectSpec.files.map(validateProjectFile);
    const uniquePathnames = new Set();
    const tags = Array.from(new Set(projectSpec.tags || []));
    for (const file of files) {
        if (uniquePathnames.has(file.pathname)) {
            throw new TypeError('projectSpec.files must not contain two files having equivalent pathnames');
        }
        uniquePathnames.add(file.pathname);
    }
    return {
        files,
        title: projectSpec.title || 'Untitled project',
        tags,
    };
}
function validateProjectFile(projectFile) {
    if (typeof projectFile.pathname !== 'string')
        throw new TypeError('projectSpec.files.pathname must be a string');
    if (projectFile.encoding &&
        !(projectFile.encoding === EncodingKind.Base64 ||
            projectFile.encoding === EncodingKind.Utf8))
        throw new TypeError(`projectSpec.files.pathname must be one of ${Object.values(EncodingKind).join(', ')}`);
    if (typeof projectFile.content !== 'string')
        throw new TypeError('projectSpec.files.content must be a string');
    const pathname = projectFile.pathname
        .split('/')
        .filter(Boolean)
        .join('/');
    return {
        pathname,
        content: projectFile.content,
        encoding: projectFile.encoding || EncodingKind.Utf8,
    };
}
function showDynamicEditor(projectSpec, options = {}) {
    if (options.editorUrl && typeof options.editorUrl !== 'string')
        throw new TypeError('options.editorUrl, if specified, must be a string');
    if (options.target &&
        Object.values(TargetKind).indexOf(options.target) === -1)
        throw new TypeError(`options.target, if specified, must be one of the following values ${Object.values(TargetKind).join(', ')}`);
    if (options.parentEl &&
        !(typeof options.parentEl === 'string' ||
            options.parentEl instanceof HTMLElement))
        throw new TypeError('options.parentEl, if specified, must be a string or an instance of an HTMLElement');
    if (options.parentEl && options.target)
        throw new TypeError('options.parentEl is incompatible with options.target');
    const projectDef = normalizeProject(projectSpec);
    const query = buildDynamicEmbedQueryString(options);
    const form = window.document.createElement('form');
    const input = window.document.createElement('input');
    form.style.display = 'none';
    input.type = 'hidden';
    const setArrayField = (path, values) => {
        if (typeof path === 'string')
            path = path.split('.');
        path.push('');
        values.forEach(function (value) {
            setField(path, value);
        });
    };
    const setField = (path, value) => {
        if (typeof path === 'string')
            path = path.split('.');
        const name = path.shift() + path.map(segment => '[' + segment + ']').join('');
        input.name = name;
        input.value = value;
        form.appendChild(input.cloneNode());
    };
    setArrayField('tags', projectDef.tags);
    setField('title', projectDef.title);
    for (const file of projectDef.files) {
        setField(['entries', file.pathname, 'content'], file.content);
        setField(['entries', file.pathname, 'encoding'], file.encoding);
    }
    let target = options.target || '_blank';
    if (options.parentEl) {
        const containerEl = typeof options.parentEl === 'string'
            ? document.getElementById(options.parentEl)
            : options.parentEl;
        if (!(containerEl instanceof HTMLElement))
            throw new Error(`Unable to resolve ${options.parentEl} to an html element`);
        target = `plnkr-${Math.random()
            .toString(36)
            .slice(2)}`;
        const iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('name', target);
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('width', '100%');
        iframe.style.minHeight = '250px';
        iframe.style.overflow = 'hidden';
        iframe.style.width = '100%';
        containerEl.appendChild(iframe);
    }
    const editorUrl = options.editorUrl
        ? options.editorUrl.replace(/\/$/, '')
        : DEFAULT_EDITOR_URL;
    form.action = `${editorUrl}/${query}`;
    form.method = 'POST';
    form.target = target;
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
function showDynamicEmbed(projectSpec, options = {}) {
    if (typeof projectSpec.source === 'object' &&
        (!projectSpec.source ||
            typeof projectSpec.source.type !== 'string' ||
            !projectSpec.source.type ||
            typeof projectSpec.source.url !== 'string' ||
            !projectSpec.source.url))
        throw new TypeError('projectSpec.source, if specified, must be an object with non-empty values for the type and url properties');
    if (options.embedUrl && typeof options.embedUrl !== 'string')
        throw new TypeError('options.embedUrl, if specified, must be a string');
    if (options.target &&
        Object.values(TargetKind).indexOf(options.target) === -1)
        throw new TypeError(`options.target, if specified, must be one of the following values ${Object.values(TargetKind).join(', ')}`);
    if (options.parentEl &&
        !(typeof options.parentEl === 'string' ||
            options.parentEl instanceof HTMLElement))
        throw new TypeError('options.parentEl, if specified, must be a string or an instance of an HTMLElement');
    if (options.parentEl && options.target)
        throw new TypeError('options.parentEl is incompatible with options.target');
    const projectDef = normalizeProject(projectSpec);
    const query = buildDynamicEmbedQueryString(options);
    const form = window.document.createElement('form');
    const input = window.document.createElement('input');
    form.style.display = 'none';
    input.type = 'hidden';
    const setArrayField = (path, values) => {
        if (typeof path === 'string')
            path = path.split('.');
        path.push('');
        values.forEach(function (value) {
            setField(path, value);
        });
    };
    const setField = (path, value) => {
        if (typeof path === 'string')
            path = path.split('.');
        const name = path.shift() + path.map(segment => '[' + segment + ']').join('');
        input.name = name;
        input.value = value;
        form.appendChild(input.cloneNode());
    };
    setArrayField('tags', projectDef.tags);
    setField('title', projectDef.title);
    for (const file of projectDef.files) {
        setField(['entries', file.pathname, 'content'], file.content);
        setField(['entries', file.pathname, 'encoding'], file.encoding);
    }
    if (projectSpec.source) {
        setField('source.type', projectSpec.source.type);
        setField('source.url', projectSpec.source.url);
    }
    let target = options.target || '_blank';
    if (options.parentEl) {
        const containerEl = typeof options.parentEl === 'string'
            ? document.getElementById(options.parentEl)
            : options.parentEl;
        if (!(containerEl instanceof HTMLElement))
            throw new Error(`Unable to resolve ${options.parentEl} to an html element`);
        target = `plnkr-${Math.random()
            .toString(36)
            .slice(2)}`;
        const iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('name', target);
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('width', '100%');
        iframe.style.minHeight = '250px';
        iframe.style.overflow = 'hidden';
        iframe.style.width = '100%';
        containerEl.appendChild(iframe);
    }
    const embedUrl = options.embedUrl
        ? options.embedUrl.replace(/\/$/, '')
        : DEFAULT_EMBED_URL;
    form.action = `${embedUrl}/${query}`;
    form.method = 'POST';
    form.target = target;
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

export { EncodingKind, SidebarKind, TargetKind, showDynamicEditor, showDynamicEmbed };
//# sourceMappingURL=index.esm.js.map
