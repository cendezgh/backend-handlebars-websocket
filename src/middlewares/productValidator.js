export const productValidator = (req, res, next) => {
  const { title, description, code, price, stock, category } = req.body;

  if (
    title === undefined ||
    typeof title !== "string" ||
    description === undefined ||
    typeof description !== "string" ||
    code === undefined ||
    typeof code !== "string" ||
    price === undefined ||
    typeof price !== "number" ||
    stock === undefined ||
    typeof stock !== "number" ||
    category === undefined ||
    typeof category !== "string"
  ) {
    res.status(400).json({ msg: "Invalid body" });
  } else {
    next();
  }
};
