# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  SITE_NAME = "TO Events Calendar"

  # Make the site name variable globally accessible in the templates, which for some reason, constants are not.
  def site_name
    SITE_NAME
  end
  
  # The page title setter / getter
  # You can pass in a String,
  # or even an Array if you want a multi-part title (e.g. "Personal | My Projects | Kipu")
  def title(title = nil)
    raise TypeError, "expecting a String or an Array" unless [String,Array].include?(title.class) || title.nil?
    separator = " ~ "
    @page_title = title if title
    if @page_title
      title = @page_title.to_a.flatten
      [@page_title, site_name].flatten.reverse.join(separator)
    else
      site_name
    end
  end
  
  def body_classes
    layout = response.layout.gsub(/s(?=\/)/,'').parameterize
    [ controller.controller_name,
      controller.action_name,
      (layout unless layout.ends_with?('-application')),
      ("calendar calendar-#{request.format.to_sym}" unless request.format.to_sym == :html)
    ].compact.uniq.join(' ')
  end
end
