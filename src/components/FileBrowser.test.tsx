import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FileBrowser } from './FileBrowser'

const file = {
  name: 'weather_1_2_2025-01-01_2025-01-01_20250101T000000000000Z.json',
  size: 128,
  created_at: '2025-01-01T00:00:00Z',
}

describe('FileBrowser', () => {
  afterEach(() => vi.restoreAllMocks())

  it('asks for confirmation before deleting a file', () => {
    const onDelete = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    render(
      <FileBrowser
        files={[file]}
        selected={file.name}
        loading={false}
        error={null}
        deleting={null}
        onRefresh={() => undefined}
        onSelect={() => undefined}
        onDelete={onDelete}
      />,
    )

    const button = screen.getByRole('button', { name: `Delete ${file.name}` })
    fireEvent.click(button)
    expect(onDelete).not.toHaveBeenCalled()
    fireEvent.click(button)
    expect(onDelete).toHaveBeenCalledWith(file.name)
  })
})
