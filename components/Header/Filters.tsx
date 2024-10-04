import { AccountFilter } from "../common/account-filter"
import { DateFilter } from "../common/date-filter"


export const Filters = () => {
    return (
        <div className="flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2">
            <AccountFilter />
            <DateFilter />
        </div>
    )
}