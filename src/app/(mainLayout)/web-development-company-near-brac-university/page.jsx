import LocalLanding, { LocalSchema, localMetadata } from "@/components/LocalPage/LocalLanding";
import { LOCAL_PAGES } from "@/data/localPages";

const page = LOCAL_PAGES.brac;

export const metadata = localMetadata(page);

export default function Page() {
    return (
        <>
            <LocalSchema page={page} />
            <LocalLanding page={page} />
        </>
    );
}
