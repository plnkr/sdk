# Plunker SDK

A set of tools for interacting with the Plunker platform that allow you to:

1.  Generate dynamic embedded Plunks and show these in target frames or mount these in target DOM elements.

## Usage

Mount the embedded view of Plunker inside the 'embed' element with custom files, title and tags

```js
import { showDynamicEmbed } from '@plnkr/sdk';

// Generate the files for the dynamic plunk. This could easily
// be generated on the fly by your application.
const files = [
    {
        pathname: 'index.html',
        content: '<h1>Hello world</h1>',
    },
];

showDynamicEmbed(
    {
        files,
        title: 'Hello world example',
        tags: ['hello', 'world'],
    },
    {
        deferRun: true, // Don't immediately run the preview
        show: ['index.html', 'preview'], // Open the index file and preview panes
        parentEl: 'embed', // Mount the embed in the #embed element
    }
);
```

Open the embedded view of Plunker in a new window with custom files, title and tags

```js
import { showDynamicEmbed } from '@plnkr/sdk';

// Generate the files for the dynamic plunk. This could easily
// be generated on the fly by your application.
const files = [
    {
        pathname: 'index.html',
        content: '<h1>Hello world</h1>',
    },
];

showDynamicEmbed(
    {
        files,
        title: 'Hello world example',
        tags: ['hello', 'world'],
    },
    {
        deferRun: true, // Don't immediately run the preview
        show: ['index.html', 'preview'], // Open the index file and preview panes
        target: '_blank', // Mount the embed in the #embed element
    }
);
```

## API

### `showDynamicEmbed(projectSpec, options)`

Create an embedded Plunk whose content is dynamically generated and either mount it to a DOM element or open it in a new or existing iframe / window where:

*   `projectSpec` - An object having the following properties:
    *   `files` - An array of objects having the following properties:
        *   `pathname` - The full path of the file.
        *   `content` - The file's content.
        *   `encoding` - (optional) The format in which the content is encoded (utf8 / base64).
    *   `title` - (optional) The suggested title for the Plunk.
    *   `tags` - (optional) An array of suggested string tags for the Plunk.
*   `options` - (optional) An object having the following properties:
    *   `autoCloseSidebar` - (optional) A boolean determining whether the sidebar should automatically close. This is useful if embedding in tighter constraints.
    *   `deferRun` - (optional) A boolean determining whether the preview will automatically refresh on load (default, `false`) or whether the preview should require a user gesture to run (`true`).
    *   `embedUrl` - (optional) The string url of the instance of the Plunker embed server. This is useful for local testing.
    *   `parentEl` - (optional) The string element id or the DOM element in which the embed should be mounted. This is useful for generating dynamic embeds that will be shown on the same page. This option is incompatible with the `target` option.
    *   `preview` - (optional) A string representing the file that should be loaded in the default preview pane instead of using Plunker's own heuristics.
    *   `show` - (optional) An array of strings representing panes to show. These strings can be pathnames (or partial pathnames, in which the best fuzzy match will be chosen) or the string `'preview'` to show the preview pane. These panes will be opened in the order of the array from left to right.
    *   `sidebar` - (optional) The sidebar pane to show by default. Can be the string `'tree'` for the file tree or `'config'` for the configuration pane.
    *   `target` - (optional) The target frame in which the embed should be displayed. This can be the `name` of an `<iframe>`, for example, or the pseudo-targets `_self` or `_blank`. This option is incompatible with the `parentEl` option.
