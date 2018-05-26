export declare enum EncodingKind {
    Utf8 = "utf8",
    Base64 = "base64",
}
export declare enum SidebarKind {
    Preview = "tree",
    Config = "config",
}
export declare enum TargetKind {
    Blank = "_blank",
    Self = "_self",
}
export declare type FileContent = string;
export declare type FileEncoding = EncodingKind;
export declare type FilePath = string;
export declare type PreviewIdentifier = 'preview';
export declare type ProjectTitle = string;
export declare type ProjectTag = string;
export interface FileSpecification {
    pathname: FilePath;
    content: FileContent;
    encoding?: FileEncoding;
}
export interface ProjectSpecification {
    files: FileSpecification[];
    title?: ProjectTitle;
    tags?: ProjectTag[];
}
export interface EditorProjectSpecification extends ProjectSpecification {
}
export interface EmbedProjectSpecification extends ProjectSpecification {
    source?: {
        type: string;
        url: string;
    };
}
export interface DynamicOptions {
    parentEl?: string | HTMLElement;
    preview?: FilePath;
    show?: (FilePath | PreviewIdentifier)[];
    sidebar?: SidebarKind;
    target?: TargetKind;
}
export interface DynamicEditorOptions extends DynamicOptions {
    editorUrl?: string;
}
export interface DynamicEmbedOptions extends DynamicOptions {
    autoCloseSidebar?: boolean;
    deferRun?: boolean;
    embedUrl?: string;
}
export declare function showDynamicEditor(projectSpec: EditorProjectSpecification, options?: DynamicEditorOptions): void;
export declare function showDynamicEmbed(projectSpec: EmbedProjectSpecification, options?: DynamicEmbedOptions): void;
