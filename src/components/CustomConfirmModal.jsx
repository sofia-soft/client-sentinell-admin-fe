import {Button, Text} from '@mantine/core';
import {modals} from '@mantine/modals';

export function CustomConfirmModal({
                                       title,
                                       description,
                                       confirmLabel = 'Delete',
                                       cancelLabel = 'Close',
                                       confirmColor = "blue",
                                       onConfirm,
                                       onCancel,

                                   }) {

    modals.openConfirmModal({
        title,
        centered: true,
        children: <Text size="sm">{description}</Text>,
        labels: {
            confirm: confirmLabel,
            cancel: cancelLabel,
        },
        confirmProps: {
            color: confirmColor,
        },
        onConfirm,
        onCancel,
    });
}