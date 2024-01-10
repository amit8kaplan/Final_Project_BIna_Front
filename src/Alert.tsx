
interface AlertProps {
    children: React.ReactNode
    onDismiss: () => void
}

function Alert({ children, onDismiss }: AlertProps) {

    const dismiss = () => {
        console.log("Dismissing alert")
        onDismiss();
    }

    return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {children}
            <button onClick={dismiss} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    )
}

export default Alert