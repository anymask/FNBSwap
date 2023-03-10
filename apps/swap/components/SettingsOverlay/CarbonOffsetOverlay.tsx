import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { useIsMounted } from '@sushiswap/hooks'
import { Button, CarbonIcon, Link, Overlay, SlideIn, Switch, Tooltip, Typography } from '@sushiswap/ui'
import { useSettings } from '../../lib/state/storage'
import React, { FC, useState } from 'react'

export const CarbonOffsetOverlay: FC = () => {
  const isMounted = useIsMounted()
  const [open, setOpen] = useState<boolean>(false)

  const [{ carbonOffset }, { updateCarbonOffset }] = useSettings()

  if (!isMounted) return <></>

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-between w-full gap-3 group rounded-xl"
      >
        <div className="flex items-center justify-center w-5 h-5">
          <CarbonIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
        </div>
        <div className="flex items-center justify-between w-full gap-1 py-4">
          <div className="flex items-center gap-1">
            <Typography variant="sm" weight={500}>
              Carbon Offset
            </Typography>
            <Tooltip
              button={<InformationCircleIcon width={14} height={14} />}
              panel={
                <div className="flex flex-col gap-2 w-80">
                  <Typography variant="xs" weight={500}>
                    Make transactions climate positive by offsetting them with Klima Infinity. The average cost to
                    offset a transaction on Polygon is less than $0.01.
                  </Typography>
                  <Typography variant="xs" weight={400} className="text-slate-500">
                    <Button variant="empty" size="xs" className="!p-0 !text-xs font-normal">
                      <Link.External
                        className="!no-underline"
                        href="https://www.klimadao.finance/blog/klimadao-sushi-fully-automated-carbon-offsetting-green-fee"
                      >
                        Learn more
                      </Link.External>
                    </Button>
                  </Typography>
                </div>
              }
            />
          </div>
          <div className="flex gap-1">
            <Typography variant="sm" weight={500} className="group-hover:text-slate-200 text-slate-400">
              {carbonOffset ? 'On' : 'Off'}
            </Typography>
            <div className="w-5 h-5 -mr-1.5 flex items-center">
              <ChevronRightIcon width={16} height={16} className="group-hover:text-slate-200 text-slate-300" />
            </div>
          </div>
        </div>
      </button>
      <SlideIn.FromLeft show={open} onClose={() => setOpen(false)} className="!mt-0">
        <Overlay.Content className="!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Carbon Offset" />
          <div className="flex flex-col gap-2 py-3 mx-1 border-b border-slate-200/5">
            <div className="flex items-center justify-between gap-3 mb-1">
              <Typography variant="sm" className="text-slate-50" weight={500}>
                Carbon Offset
              </Typography>
              <Switch checked={carbonOffset} onChange={() => updateCarbonOffset(!carbonOffset)} size="sm" />
            </div>
            <Typography variant="xs" weight={400} className="text-slate-500">
              Make transactions climate positive by offsetting them with Klima Infinity. The average cost to offset a
              transaction on Polygon is less than $0.01.
            </Typography>
            <Typography variant="xs" weight={400} className="text-slate-500">
              <Button variant="empty" size="xs" className="!p-0 !text-xs font-normal">
                <Link.External
                  href="https://www.klimadao.finance/blog/klimadao-sushi-fully-automated-carbon-offsetting-green-fee"
                  className="inline-flex decoration-transparent"
                >
                  Learn more
                </Link.External>
              </Button>
            </Typography>
          </div>
        </Overlay.Content>
      </SlideIn.FromLeft>
    </div>
  )
}
