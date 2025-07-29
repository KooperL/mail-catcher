routerAdd("get", "/", (c) => {
    const html = $template.loadFiles(
      `${__hooks}/views/layout.html`,
      `${__hooks}/views/emailList.html`,
    ).render({
      PB_HOST: 'http://127.0.0.1:8090'
    })
  
    return c.html(200, html)
  })
  