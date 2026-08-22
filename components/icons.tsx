import type { IconProps } from "@mingcute/react";
import {
  AddFilled as BaseAddFilled,
  AlertFilled as BaseAlertFilled,
  ArrowLeftFilled as BaseArrowLeftFilled,
  BookFilled as BaseBookFilled,
  CalendarAddFilled as BaseCalendarAddFilled,
  CalendarFilled as BaseCalendarFilled,
  CalendarXFilled as BaseCalendarXFilled,
  CellphoneFilled as BaseCellphoneFilled,
  Chat2Filled as BaseChat2Filled,
  CheckCircleFilled as BaseCheckCircleFilled,
  CheckFilled as BaseCheckFilled,
  CloseCircleFilled as BaseCloseCircleFilled,
  CloseFilled as BaseCloseFilled,
  Delete2Filled as BaseDelete2Filled,
  DeleteFilled as BaseDeleteFilled,
  DownFilled as BaseDownFilled,
  DownloadFilled as BaseDownloadFilled,
  Edit2Filled as BaseEdit2Filled,
  ExitFilled as BaseExitFilled,
  FlaskFilled as BaseFlaskFilled,
  GrassFilled as BaseGrassFilled,
  GroupFilled as BaseGroupFilled,
  InboxFilled as BaseInboxFilled,
  InformationFilled as BaseInformationFilled,
  LeafFilled as BaseLeafFilled,
  Loading3Filled as BaseLoading3Filled,
  LocationFilled as BaseLocationFilled,
  LockFilled as BaseLockFilled,
  MonitorFilled as BaseMonitorFilled,
  MoonFilled as BaseMoonFilled,
  MortarboardFilled as BaseMortarboardFilled,
  Presentation1Filled as BasePresentation1Filled,
  Refresh2Filled as BaseRefresh2Filled,
  RefreshAnticlockwise1Filled as BaseRefreshAnticlockwise1Filled,
  RoundFilled as BaseRoundFilled,
  ScheduleFilled as BaseScheduleFilled,
  Search2Filled as BaseSearchFilled,
  SelectorVerticalFilled as BaseSelectorVerticalFilled,
  Settings6Filled as BaseSettings6Filled,
  SnowflakeFilled as BaseSnowflakeFilled,
  SunFilled as BaseSunFilled,
  TimeFilled as BaseTimeFilled,
  UpFilled as BaseUpFilled,
  UploadFilled as BaseUploadFilled,
  User3Filled as BaseUser1Filled,
  UserAdd2Filled as BaseUserAddFilled,
  UserSearchFilled as BaseUserSearchFilled,
  WarningFilled as BaseWarningFilled,
} from "@mingcute/react/core-filled";

/**
 * Mingcute's `Icon` always writes an inline `style="color: currentColor"`.
 * Because an inline declaration outranks a class, that silently defeats every
 * Tailwind `text-*` utility placed on an icon — the icon just inherits the
 * surrounding text color instead. Dropping the inline `color` restores the
 * lucide-style behaviour these components are written against, so `text-*`
 * (including `dark:` variants) works again. An explicit `style.color` from the
 * caller still wins, since it is spread last.
 */
function themeable(Icon: React.ComponentType<IconProps>) {
  return function ThemeableIcon({ style, ...props }: IconProps) {
    return <Icon {...props} style={{ color: undefined, ...style }} />;
  };
}

export const AddFilled = themeable(BaseAddFilled);
export const AlertFilled = themeable(BaseAlertFilled);
export const ArrowLeftFilled = themeable(BaseArrowLeftFilled);
export const BookFilled = themeable(BaseBookFilled);
export const CalendarAddFilled = themeable(BaseCalendarAddFilled);
export const CalendarFilled = themeable(BaseCalendarFilled);
export const CalendarXFilled = themeable(BaseCalendarXFilled);
export const CellphoneFilled = themeable(BaseCellphoneFilled);
export const Chat2Filled = themeable(BaseChat2Filled);
export const CheckCircleFilled = themeable(BaseCheckCircleFilled);
export const CheckFilled = themeable(BaseCheckFilled);
export const CloseCircleFilled = themeable(BaseCloseCircleFilled);
export const CloseFilled = themeable(BaseCloseFilled);
export const Delete2Filled = themeable(BaseDelete2Filled);
export const DeleteFilled = themeable(BaseDeleteFilled);
export const DownFilled = themeable(BaseDownFilled);
export const DownloadFilled = themeable(BaseDownloadFilled);
export const Edit2Filled = themeable(BaseEdit2Filled);
export const ExitFilled = themeable(BaseExitFilled);
export const FlaskFilled = themeable(BaseFlaskFilled);
export const GrassFilled = themeable(BaseGrassFilled);
export const GroupFilled = themeable(BaseGroupFilled);
export const InboxFilled = themeable(BaseInboxFilled);
export const InformationFilled = themeable(BaseInformationFilled);
export const LeafFilled = themeable(BaseLeafFilled);
export const Loading3Filled = themeable(BaseLoading3Filled);
export const LocationFilled = themeable(BaseLocationFilled);
export const LockFilled = themeable(BaseLockFilled);
export const MonitorFilled = themeable(BaseMonitorFilled);
export const MoonFilled = themeable(BaseMoonFilled);
export const MortarboardFilled = themeable(BaseMortarboardFilled);
export const Presentation1Filled = themeable(BasePresentation1Filled);
export const Refresh2Filled = themeable(BaseRefresh2Filled);
export const RefreshAnticlockwise1Filled = themeable(
  BaseRefreshAnticlockwise1Filled,
);
export const RoundFilled = themeable(BaseRoundFilled);
export const ScheduleFilled = themeable(BaseScheduleFilled);
export const SearchFilled = themeable(BaseSearchFilled);
export const SelectorVerticalFilled = themeable(BaseSelectorVerticalFilled);
export const Settings6Filled = themeable(BaseSettings6Filled);
export const SnowflakeFilled = themeable(BaseSnowflakeFilled);
export const SunFilled = themeable(BaseSunFilled);
export const TimeFilled = themeable(BaseTimeFilled);
export const UpFilled = themeable(BaseUpFilled);
export const UploadFilled = themeable(BaseUploadFilled);
export const UserFilled = themeable(BaseUser1Filled);
export const UserAddFilled = themeable(BaseUserAddFilled);
export const UserSearchFilled = themeable(BaseUserSearchFilled);
export const WarningFilled = themeable(BaseWarningFilled);
