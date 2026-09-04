type ShouldMarkNotificationsReadOnOpenParams = {
  hasUnreadNotifications: boolean
  isMarkingNotificationsRead: boolean
  isOpen: boolean
  readWasRequestedForCurrentOpen: boolean
}

export const shouldMarkNotificationsReadOnOpen = ({
  hasUnreadNotifications,
  isMarkingNotificationsRead,
  isOpen,
  readWasRequestedForCurrentOpen,
}: ShouldMarkNotificationsReadOnOpenParams): boolean =>
  isOpen && hasUnreadNotifications && !isMarkingNotificationsRead && !readWasRequestedForCurrentOpen
