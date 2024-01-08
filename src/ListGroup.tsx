function ListGroup() {
    const items: string[] = ['item1', 'item2', 'item3', 'item4', 'item5']


    return (
        <div>
            <ul className="list-group">
                {items.length == 0 && <p>No Items...</p>}
                {items.map((item, index) => <li className="list-group-item" key={index}>{item}</li>)}
            </ul>
        </div>
    )
}

export default ListGroup