/** A service owns data access: here a stand-in for a call to the app's API. */
export async function fetchStatus(): Promise<{ online: boolean }> {
    return { online: true };
}
