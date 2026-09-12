import { describe, it, expect, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import ShowCard from '@/components/shared/ShowCard.vue'
import { createMockShow } from '@/mocks/shows'
import type { Show } from '@/types'

const mockShow: Show = createMockShow({
  id: 1,
  name: 'Test Show',
  network: {
    name: 'HBO',
    id: 0,
  },
  genres: ['Drama', 'Sci-Fi'],
  image: { medium: 'medium.jpg', original: 'original.jpg' },
  summary: '<p>A great show.</p>',
  rating: { average: 8.5 },
})

describe('ShowCard', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ShowCard, {
      props: { show: mockShow },
      global: {
        stubs: {
          'router-link': RouterLinkStub,
        },
      },
    })
  })

  it('renders show name and network', () => {
    expect(wrapper.text()).toContain('Test Show')
    expect(wrapper.text()).toContain('HBO')
    expect(wrapper.text()).toContain(mockShow.premiered?.slice(0, 4))
  })

  it('renders correct description without HTML tags', () => {
    expect(wrapper.text()).toContain('A great show.')
    expect(wrapper.text()).not.toContain('<p>')
  })

  it('emits click event when a link is clicked', async () => {
    const links = wrapper.findAllComponents(RouterLinkStub)
    await links[0].trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]).toEqual([mockShow])
  })
})
