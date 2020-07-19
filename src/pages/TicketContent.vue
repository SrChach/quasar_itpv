<template>
  <q-page padding>
    <h4>Contenido de los tickets</h4>
    <pre>
      {{ templates }}
    </pre>
  </q-page>
</template>

<script>
export default {
  name: 'TicketContent',
  data: function () {
    return {
      templates: [
        {
          name: 'Ticket ejemplo',
          max_chars: 28,
          size: '58mm',
          constraints: 'Describe las restricciones para que aparezca',
          xml: `
            <ticket>
              <image>Printer.Ticket.Logo</image>
              <line></line>
              ...
          `
        },
        {
          name: 'ejemplo2',
          max_chars: '...'
        }
      ]
    }
  }
}
</script>
