import { render, screen } from '@testing-library/react'
import Note from './Note'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'
import NoteForm from './Noteform'
import { beforeEach, describe, expect } from 'vitest'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }

  render(<Note note={note} />)

  const element = screen.getByText(
    'Component testing is done with react-testing-library',
  )

  //screen.debug(element)
  expect(element).toBeDefined()
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }

  const mockHandler = vi.fn()

  render(<Note note={note} toogleImportance={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

describe('<Togglable />', () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show...">
        <div>togglable content</div>
      </Togglable>,
    )
  })

  //the text is present in the html.
  test('renders its children', () => {
    screen.getByText('togglable content')
  })

  //at first content are hidden
  test('at start the children are not displayed', () => {
    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()
  })

  //the show button working as expected
  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const element = screen.getByText('togglable content')
    expect(element).toBeVisible()
  })

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closedButton = screen.getByText('cancel')
    await user.click(closedButton)

    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()
  })
})

describe('<NoteForm />', () => {
  test('updates parent states and calls onSubmit', async () => {
    const createNote = vi.fn()
    const user = userEvent.setup()

    const { container } = render(<NoteForm createNote={createNote} />)
    const input = container.querySelector('#note-input')
    const sendButton = screen.getByText('save')

    await user.type(input, 'testing the form...')
    await user.click(sendButton)

    expect(createNote.mock.calls).toHaveLength(1)
    //console.log(createNote.mock.calls)
    expect(createNote.mock.calls[0][0].content).toBe('testing the form...')
  })
})
