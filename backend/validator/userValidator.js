import yup from "yup"

export const userSchema = yup.object({

    username:yup
    .string()
    .trim()
    .min(3,'Username must be atleast 3 character')
    .required(),
    name:yup
    .string()
    .trim()
    .min(3,'name must be atleast 3 character')
    .required(),
    email: yup
    .string()
    .email("The email is not valid one")
    .required(),
    password: yup
    .string()
    .min(4,'password must be at least 4 characters')
    .required()
})

export const validateUser = (schema) => async (req,res,next) => {
    try {
        await schema.validate(req.body);
        next();
    } catch (err) {
        return res.status(400).send({errors:err.errors})
    }
}