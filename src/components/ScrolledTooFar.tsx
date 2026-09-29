import GridSectionHeader from "./GridSectionHeader";
import { CONTENT } from "../constants";

const ScrolledTooFar = () => {
    const email = CONTENT.social.find(s => s.name === "Email")?.link?.replace('mailto:', '') || 'theanilpaneru@gmail.com';

    return (
        <section className="text-center" aria-labelledby="cta-scrolled-heading">
            <GridSectionHeader title="Scrolled Too Far" className="!mb-0" />
            <div className="pt-6 pb-2 sm:pt-8 sm:pb-4 flex flex-col items-center justify-center">
                <p className="text-sm sm:text-base text-md-on-surface-variant mb-4 max-w-md">
                    If you've read this far, you might be interested in what I do.
                </p>
                <a
                    href={`mailto:${email}?subject=Let's%20Talk`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-md-primary text-md-on-primary font-medium text-sm sm:text-base transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-sm active:translate-y-0 cursor-pointer"
                >
                    Let’s Talk <span>&rarr;</span>
                </a>
                <p className="text-xs text-md-on-surface-variant/75 mt-3">
                    When reaching out, please{" "}
                    <a
                        href="https://nohello.net/en/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-dotted decoration-md-outline/60 hover:text-md-on-background hover:decoration-solid underline-offset-2 transition-colors"
                    >
                        no hello
                    </a>
                    .
                </p>
            </div>
        </section>
    );
};

export default ScrolledTooFar;
