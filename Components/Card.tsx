function Card ({ title, children }) {
  return (
    <div className='card'>
      {title && <div className='card-header p-2'>{title}</div>}
      <div className='card-content p-2'>
        {children}
      </div>
    </div>
  )
}

export default Card
