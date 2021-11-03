export const app = {
    name: 'EpiMac Intranet',
    version: '1.0.0',
    repository: 'https://github.com/EpiMac/intranet'
};

export function title(page) {
    return app.name + (page ? ` — ${page}` : '');
}
