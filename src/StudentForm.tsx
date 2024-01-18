import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValues, useForm } from "react-hook-form"
import z from "zod"

const schema = z.object({
    name: z.string().min(3, "Name must be longer then 3 charecters").max(20, "Name must be less then 20 charecters"),
    age: z.number({ invalid_type_error: "Age is requiered" }).min(18, "Age must be more then 18"),
})

type FormData = z.infer<typeof schema>


function StudentForm() {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

    const onSubmit = (data: FieldValues) => {
        console.log("on submit")
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Name</label>
            <input {...register("name")} type="text" id="name" className="form-control" />
            {errors.name && <p className="text-danger">{errors.name.message}</p>}
            <div className="mb-3">
                <label htmlFor="age">Age</label>
                <input {...register("age", { valueAsNumber: true })} type="number" id="age" className="form-control" />
                {errors.age && <p className="text-danger">{errors.age.message}</p>}

            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default StudentForm