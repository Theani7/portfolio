const Container = ({ children }) => {
    return (
        <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-10 md:py-16">
            {children}
        </div>
    );
};

export default Container;
