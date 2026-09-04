import { describe, expect, it } from 'vitest'

import { shouldMarkNotificationsReadOnOpen } from './notificationsReadState'

describe('shouldMarkNotificationsReadOnOpen', () => {
  it('marks unread notifications once when the panel opens', () => {
    expect(
      shouldMarkNotificationsReadOnOpen({
        hasUnreadNotifications: true,
        isMarkingNotificationsRead: false,
        isOpen: true,
        readWasRequestedForCurrentOpen: false,
      })
    ).toBe(true)
  })

  it('does not mark notifications again during the same open session', () => {
    expect(
      shouldMarkNotificationsReadOnOpen({
        hasUnreadNotifications: true,
        isMarkingNotificationsRead: false,
        isOpen: true,
        readWasRequestedForCurrentOpen: true,
      })
    ).toBe(false)
  })

  it('waits until the panel is open and the mutation is idle', () => {
    expect(
      shouldMarkNotificationsReadOnOpen({
        hasUnreadNotifications: true,
        isMarkingNotificationsRead: false,
        isOpen: false,
        readWasRequestedForCurrentOpen: false,
      })
    ).toBe(false)
    expect(
      shouldMarkNotificationsReadOnOpen({
        hasUnreadNotifications: true,
        isMarkingNotificationsRead: true,
        isOpen: true,
        readWasRequestedForCurrentOpen: false,
      })
    ).toBe(false)
  })

  it('does not call mark-read when there are no unread notifications', () => {
    expect(
      shouldMarkNotificationsReadOnOpen({
        hasUnreadNotifications: false,
        isMarkingNotificationsRead: false,
        isOpen: true,
        readWasRequestedForCurrentOpen: false,
      })
    ).toBe(false)
  })
})
