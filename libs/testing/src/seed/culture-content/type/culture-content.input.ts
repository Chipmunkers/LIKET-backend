/**
 * @author jochongs
 */
export type CultureContentInput = {
  genreIdx?: number;
  ageIdx?: number;
  userIdx: number;
  styleIdxList?: number[];
  imgList?: string[];
  location?: {
    address?: string;
    detailAddress?: string | null;
    region1Depth?: string;
    region2Depth?: string;
    hCode?: string;
    bCode?: string;
    positionX?: number;
    positionY?: number;
    sidoCode?: string;
    sggCode?: string;
    legCode?: string;
    riCode?: string;
  };
  performId?: string | null;
  title?: string;
  description?: string | null;
  websiteLink?: string;
  startDate?: Date;
  endDate?: Date | null;
  viewCount?: number;
  openTime?: string;
  isFee?: boolean;
  isReservation?: boolean;
  isPet?: boolean;
  isParking?: boolean;
  likeCount?: number;
  acceptedAt?: Date | null;
  deletedAt?: Date | null;
};
