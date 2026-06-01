import { ThemeSwitcher } from "@/shared/components/ui";

export function Settings() {
    return (
        <div>
            <ul className="flex flex-col gap-5">
                <li className="flex items-center gap-4">
                    <p className="w-xs text-md">Тема оформления</p>
                    <ThemeSwitcher />
                </li>
            </ul>
        </div>
    )
}