    // components/PartCard.jsx

    const cardStyles = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    margin: '10px',
    maxWidth: '300px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    };

    const PartCard = ({ part }) => {
    return (
        <div style={cardStyles}>
        <h3>{part.name}</h3>
        </div>
    );
    };

    export default PartCard;
