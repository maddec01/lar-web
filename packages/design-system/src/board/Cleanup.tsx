// What removing work's old branches and worktrees would lose, in a confirmation.

/** Each branch with the files and commits deleting it would lose, as a nested bulleted list. */
export function LossList({ branches }: { branches: { name: string; losses: string[] }[] }) {
    return (
        <ul className="m-0 list-disc ps-5 wrap-anywhere">
            {branches.map((branch) => (
                <li key={branch.name}>
                    <span>{branch.name}</span>
                    <ul className="m-0 list-disc ps-5">
                        {branch.losses.map((loss) => (
                            <li key={loss}>{loss}</li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
}
