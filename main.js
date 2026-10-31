const { app, BrowserWindow, protocol, net, shell } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }]);

app.whenReady().then(() => {
  protocol.handle("app", req => {
    let p = decodeURIComponent(new URL(req.url).pathname);
    if (!p || p === "/") p = "/index.html";
    const alvo = path.normalize(path.join(__dirname, p));
    if (!alvo.startsWith(__dirname)) return new Response("negado", { status: 403 });
    return net.fetch(pathToFileURL(alvo).toString());
  });
  const w = new BrowserWindow({ width: 1440, height: 920, title: "Estúdio Motion", autoHideMenuBar: true, backgroundColor: "#121317",
    webPreferences: { contextIsolation: true, sandbox: true } });
  w.loadURL("app://estudio/index.html");
  w.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
});
app.on("window-all-closed", () => app.quit());
