Haml::Template.options.merge! :attr_wrapper => '"',
                              :escape_html => true  # Enable XSS protection by default. Use != instead of = to bypass. 
                                                    # I understand this might be a bit anal retentive in some cases, but security trumps convenience here.
