/**
 * @author jochongs
 */
export type NoticeInput = {
  title?: string;
  contents?: string;
  activatedAt?: Date | null;
  pinnedAt?: Date | null;
  deletedAt?: Date | null;
};
