const Container = ({ children }) => {
    return (
        <div className="mx-auto max-w-screen-xl px-4 py-8 md:py-12">
            {children}
        </div>
    );
};

export default Container;
