import PropTypes from 'prop-types';

/**
 * CardPortal component
 *
 * @param {Object} props
 * @param {Object} props.gasha - The gasha object.
 * @param {number} props.gasha.id - The gasha ID.
 * @param {string} props.gasha.name - The gasha name.
 * @param {Function} props.handleTabLink - The function to handle the tab link.
 * @param {string} props.backgroundUrl - The background URL.
 * @returns {JSX.Element}
 */
function CardPortal({
  gasha,
  handleTabLink,
  backgroundUrl,
}) {
  return (
    <button
      type="button"
      onClick={() => handleTabLink(gasha.id)}
      key={gasha.id}
      className="card"
      title={gasha.name}
    >
      <div
        className="card-background"
        style={{ backgroundImage: `url("${backgroundUrl}${gasha.id}.png")` }}
      />
      <h2 className="card-title">
        {gasha.name}
      </h2>
    </button>
  );
}

CardPortal.propTypes = {
  gasha: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  handleTabLink: PropTypes.func.isRequired,
  backgroundUrl: PropTypes.string.isRequired,
};

export default CardPortal;
