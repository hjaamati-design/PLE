let _canPlayWebm: boolean | null = null;

export function canPlayWebm(): boolean {
    if (_canPlayWebm !== null) return _canPlayWebm;
    if (typeof window === "undefined") return true;
    const video = document.createElement("video");
    _canPlayWebm = !!video.canPlayType('video/webm; codecs="vp8, vorbis"');
    return _canPlayWebm;
}

export function resolveVideoUrl(url: string): string {
    if (!url || canPlayWebm()) return url;
    return url.replace(/\.webm$/, ".mp4");
}
