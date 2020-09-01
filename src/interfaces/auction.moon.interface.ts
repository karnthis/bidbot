import {MoonInterface} from "./moon.interface";
import {Dayjs} from "dayjs";

export interface AuctionMoonInterface extends MoonInterface {
    currentHighBidder: string,
    currentBid: number,
    timeRemaining: Dayjs,
}