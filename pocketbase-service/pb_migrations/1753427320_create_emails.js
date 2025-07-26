migrate((app) => {
  let collection = new Collection({
      type:       "base", // base | auth | view
      name:       "emails",
      listRule:   "",
      viewRule:   "",
      createRule: "",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
          {
              name: "username",
              type: "text",
              required: false,
              max: 50,
          },
          {
              name: "html",
              type: "text",
              required: false,
              max: 50000,
          },
          {
              name: "text",
              type: "text",
              required: false,
              max: 50000,
          },
          {
              name: "restProps",
              type: "text",
              required: false,
              max: 50000,
          },
      ],
      indexes: [
          "CREATE UNIQUE INDEX idx_user ON emails (username)"
      ],
  })
}, (app) => {
  // No down migration
})

