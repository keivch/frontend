import PropTypes from 'prop-types'

function Button ({ type, name, onClick }) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <button
                type={type}
                name={name}
                onClick={onClick}
                className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 transition-all hover:scale-105 text-white text-2xl font-bold p-4 rounded-lg w-full shadow-lg"
            >
                {name}
            </button>
        </div>
    );
}

Button.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func
}

export default Button