routerAdd("GET", "/api/emails", (e) => {
    let username = e.requestInfo().query["subject"]
    let records = $app.findRecordsByFilter(
        "emails",
        "username = {:username}",
        "-created", // sort
        500, // limit
        0, // offset
        { "username": username.toLowerCase() }, // filter params
    )
    return e.json(200, records)
})

routerAdd("HEAD", "/api/webhook/mailin", (e) => {
  e.noContent(200)
})

routerAdd("POST", "/api/webhook/mailin", (e) => {
  const ct = e.request.headers.get("content-type") || "";
  if (!ct.includes("multipart/form-data")) {
    console.log("Expected multipart/form-data")
    return e.string(400, "Expected multipart/form-data");
  }

  e.request.parseMultipartForm()
  const parsed = e.request.multipartForm;

  if (!parsed?.value) {
    console.log("Missing 'mailinMsg' field")
    return e.string(400, "Missing 'mailinMsg' field");
  }

  let username;
  let restProps;
  let text;
  let html;

  try {
    let mailData = parsed.value;
    console.log(JSON.stringify(mailData.mailinMsg))
    const usernameRaw = JSON.parse(mailData.mailinMsg[0]).headers.to
    const emailMatch = usernameRaw.split(' ');
    if (emailMatch.length === 2) {
      const email = emailMatch[1].replace('<', '').replace('>', '');
      username = email.split('@')[0];
    } else if (emailMatch.length === 1) {
      const email = emailMatch[0]
      username = email.split('@')[0];
    }
    html = JSON.parse(mailData.mailinMsg[0]).html
    text = JSON.parse(mailData.mailinMsg[0]).text
    restProps = 'JSON.stringify(Object.entries(parsed))'
  } catch (err) {
    console.log("Invalid JSON: " + err.message)
    return e.string(400, "Invalid JSON: " + err.message);
  }
  try {
    console.log("Saving mail")
    let collection = $app.findCollectionByNameOrId("emails")
    let record = new Record(collection)
    // record.set('restProps', JSON.stringify(Object.entries(parsed)))
    // record.set('html', JSON.stringify({}))
    // record.set('text', JSON.stringify(parsed.value))
    // record.set('username', '')
    record.set('restProps', restProps)
    record.set('html', html)
    record.set('text', text)
    record.set('username', username)
    $app.save(record);

    return e.string(200, "OK");
  } catch (err) {
    console.log("Create failed: " + err.message)
    return e.string(500, "Create failed: " + err.message);
  }
})

