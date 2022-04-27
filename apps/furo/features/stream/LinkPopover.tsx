import { Popover } from '@headlessui/react'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { LinkIcon } from '@heroicons/react/solid'
import { Stream } from 'app/features/context'
import { usePopover } from 'app/hooks/usePopover'
import { FC } from 'react'
import { ArrowFlatLinesUp } from 'ui/icons'
import Typography from 'ui/typography/Typography'

interface Props {
  stream: Stream
}

const LinkPopover: FC<Props> = ({ stream }) => {
  const { styles, attributes, setReferenceElement, setPopperElement } = usePopover()

  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>
        <div className="flex items-center gap-2 px-5 border shadow-md cursor-pointer shadow-dark-1000 border-dark-800 bg-dark-900 rounded-xl h-11">
          <LinkIcon width={18} height={18} />
          <Typography variant="sm" weight={700} className="text-high-emphesis">
            Links
          </Typography>
        </div>
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="overflow-hidden z-10 bg-dark-900 shadow-depth-1 p-4 rounded-xl border border-dark-800 flex gap-4 max-w-[530px]"
      >
        <div
          onClick={() => navigator.clipboard.writeText(stream.createdBy.id)}
          className="flex flex-col items-center gap-2 p-4 border cursor-pointer rounded-xl shadow-depth-1 border-dark-800 hover:border-dark-700 active:border-dark-600"
        >
          <div className="p-4 border rounded-full border-dark-700 bg-dark-800">
            <ArrowFlatLinesUp width={48} height={48} className="transform rotate-180 text-blue" />
          </div>
          <Typography variant="xs" className="text-high-emphesis whitespace-nowrap" weight={700}>
            Copy Sender Link
          </Typography>
        </div>
        <div
          onClick={() => navigator.clipboard.writeText(stream.recipient.id)}
          className="flex flex-col items-center gap-2 p-4 border cursor-pointer rounded-xl shadow-depth-1 border-dark-800 hover:border-dark-700 active:border-dark-600"
        >
          <div className="p-4 border rounded-full border-dark-700 bg-dark-800">
            <ArrowFlatLinesUp width={48} height={48} className="text-pink" />
          </div>
          <Typography variant="xs" className="text-high-emphesis whitespace-nowrap" weight={700}>
            Copy Recipient Link
          </Typography>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border cursor-pointer rounded-xl shadow-depth-1 border-dark-800 hover:border-dark-700 active:border-dark-600">
          <div className="p-4 border rounded-full border-dark-700 bg-dark-800">
            <ExternalLinkIcon width={48} height={48} className="text-primary" />
          </div>
          <Typography variant="xs" className="text-high-emphesis whitespace-nowrap" weight={700}>
            View on Etherscan
          </Typography>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default LinkPopover
