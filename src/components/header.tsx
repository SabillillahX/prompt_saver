export function Header({ children }: { children?: React.ReactNode }) {
    return (
        <header className="flex items-center justify-between">
            {children}
        </header>
    )
}