const router = require("express").Router();
const knex = require("../data/dbConfig.js");
const { catchAsync, AppError } = require("./errors");
const { Validator } = require("jsonschema");

const validateID = catchAsync(validateAccountID);
/*----------------------------------------------------------------------------*/
/* GET
/*----------------------------------------------------------------------------*/
router.get(
  "/",
  catchAsync(async (req, res) => {
    res.status(200).json(await knex("accounts"));
  })
);

router.get(
  "/:id",
  validateID,
  catchAsync(async (req, res) => {
    res.status(200).json(req.account);
  })
);

/*----------------------------------------------------------------------------*/
/* POST
/*----------------------------------------------------------------------------*/
router.post(
  "/",
  validateAccount,
  catchAsync(async (req, res, next) => {
    //inserted ids returned as an array
    const [id] = await knex("accounts").insert(req.body);
    id
      ? res.status(201).json(await knex("accounts").where({ id }))
      : next(new AppError("Error adding the item to the database.", 500));
  })
);

/*----------------------------------------------------------------------------*/
/* PUT
/*----------------------------------------------------------------------------*/
router.put(
  "/:id",
  validateID,
  validateAccount,
  catchAsync(async (req, res, next) => {
    const { id } = req.account;
    const count = await knex("accounts").update(req.body).where({ id });
    count == 1
      ? res.status(200).json(await knex("accounts").where({ id }))
      : next(new AppError("Error updating the database.", 500));
  })
);

/*----------------------------------------------------------------------------*/
/* PATCH
/*----------------------------------------------------------------------------*/
router.patch(
  "/:id",
  validateID,
  function addExistingFields(req, res, next) {
    const { id, ...oldAccount } = req.account;
    req.body = { ...oldAccount, ...req.body };
    next();
  },
  validateAccount,
  catchAsync(async (req, res) => {
    const { id } = req.account;
    const count = await knex("accounts").update(req.body).where({ id });
    count == 1
      ? res.status(200).json(await knex("accounts").where({ id }))
      : next(new AppError("Error updating the database.", 500));
  })
);

/*----------------------------------------------------------------------------*/
/* DELETE
/*----------------------------------------------------------------------------*/
router.delete(
  "/:id",
  validateID,
  catchAsync(async (req, res) => {
    const { id } = req.account;
    const count = await knex("accounts").where({ id }).delete();
    count == 1
      ? res.status(200).json(req.account)
      : next(new AppError("Error deleting the record.", 500));
  })
);

/*----------------------------------------------------------------------------*/
/* Middleware
/*----------------------------------------------------------------------------*/
async function validateAccountID(req, res, next) {
  const { id } = req.params;
  //accounts returned as an array
  const [account] = await knex("accounts").where({ id });
  req.account = account;
  account ? next() : next(new AppError(`${id} is not a valid account ID`, 404));
}

const accountSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    budget: {
      type: "number",
    },
  },
  additionalProperties: false,
  required: ["name", "budget"],
};

function validateAccount(req, res, next) {
  const v = new Validator();
  const { errors } = v.validate(req.body, accountSchema);
  errors.length !== 0 ? next(errors) : next();
}

module.exports = router;
