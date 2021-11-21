import { title } from '../app';

export function openPopup(url, theTitle)
{
    const width = Math.min(900, screen.width - 50), height = 800;
    const x = screen.width / 2 - width / 2, y = screen.height / 2 - height / 2 - 65;
    const options = `menubar=no, status=no, scrollbars=no, menubar=no, width=${width}, height=${height}, top=${y}, left=${x}`;

    window.open(url, title(theTitle), options);
}
