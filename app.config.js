const linkUrl = {
  GHAuthorUrl: 'https://github.com/ironmaxtory',
  GHIRMToolsReleasesUrl: 'https://github.com/ironmaxtory/irm-tools/releases',
};

/**
 * 侧边栏
 * @type {Object}
 */
const sidebarConf = {
  sidebar: [{
    id: 1,
    title: 'Auto Reload',
    icon: 'icon-auto-reload',
    link: '#/autoreload',
    active: true,
  }]
};

/**
 * app菜单栏
 * @type {Array}
 */
const appMenuConf = [{
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function(item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.reload();
    }
  }],
},{
  label: 'About',
  click: function(item, focusedWindow) {
    // filled in main.js
  }
}];

var config = {
  linkUrl: linkUrl,
  sidebarConf: sidebarConf,
  appMenuConf: appMenuConf,
}

export default config;
